// Initialize Supabase client
const supabaseUrl = 'https://your-project-url.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'your-public-anon-key';  // Replace with your Supabase Public Anon Key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Elements
const chatDiv = document.getElementById('chat');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// Track current user
let currentUser = null;

// Anonymous Authentication
async function authenticate() {
    // Start a session for the anonymous user
    const { user, error } = await supabase.auth.signInWithOAuth({
        provider: 'anonymous',
    });

    if (user) {
        currentUser = user;
        loadMessages();
    } else {
        alert('Error: ' + error.message);
    }
}

// Real-time messaging
async function loadMessages() {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });

    if (data) {
        messagesDiv.innerHTML = '';
        data.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${msg.sender_id}: ${msg.message_text}`;
            messagesDiv.appendChild(messageDiv);
        });
    }

    // Listen for new messages in real-time
    supabase
        .from('messages')
        .on('INSERT', payload => {
            const newMessage = payload.new;
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${newMessage.sender_id}: ${newMessage.message_text}`;
            messagesDiv.appendChild(messageDiv);
        })
        .subscribe();
}

// Send a message
async function sendMessage() {
    const messageText = messageInput.value;
    if (messageText.trim() === '') return;

    // Insert message into Supabase
    const { error } = await supabase
        .from('messages')
        .insert([
            {
                sender_id: currentUser.id, // Anonymous user ID
                message_text: messageText
            }
        ]);

    if (error) {
        alert('Error sending message: ' + error.message);
    } else {
        messageInput.value = '';
    }
}

// Initialize the app
authenticate();
