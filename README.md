# Real-Time-Video-Conferencing-Application-with-WebRTC
WebRTC Video Chat with Messaging

This project is a WebRTC-based video chat application that allows users to connect and communicate in real-time with both video and audio. Additionally, users can exchange chat messages in a shared room, enabling real-time text-based communication during the video call.

Features

Real-Time Video and Audio Communication:

Connect with peers in a shared room using WebRTC for seamless video and audio communication.

Chat Functionality:

Send and receive chat messages during the video call.

Messages are displayed with clear distinction between the sender and the receiver.

Interactive Controls:

Mute/unmute audio.

Start/stop video.

Dynamic Peer Connection:

Automatic handling of user connections and disconnections.

Dynamically updates video streams when users join or leave the room.

Technologies Used

Frontend:

HTML, CSS, JavaScript

Backend:

Node.js

Express.js

Socket.IO (for signaling and real-time communication)

WebRTC:

Peer-to-peer video and audio streaming.

STUN servers for ICE (Interactive Connectivity Establishment).

Setup Instructions

Prerequisites

Node.js (Ensure it is installed on your system)

Basic knowledge of web development (HTML, CSS, JavaScript)

Installation

Clone the repository:

git clone https://github.com/your-username/webrtc-video-chat.git

Navigate to the project directory:

cd webrtc-video-chat

Install dependencies:

npm install

Start the server:

node server.js

Open your browser and visit:

http://localhost:3000

How It Works

Joining a Room:

Users are automatically assigned to a shared room (e.g., music-room).

Real-Time Communication:

Users joining the room establish peer-to-peer WebRTC connections.

Video and audio streams are shared between connected peers.

Chat Messaging:

Users can send text messages via the chat input box.

Messages are displayed in the chat box with identifiers (e.g., "You" or the sender's user ID).

Interactive Controls:

Mute/unmute audio or stop/start video during the call using the buttons.

Project File Structure

.
├── public/
│   ├── index.html      # Main HTML file
│   ├── script.js       # Client-side JavaScript
│   ├── styles.css      # Styling for the application
├── server.js           # Backend server file
├── package.json        # Node.js dependencies and metadata
└── README.md           # Project documentation (this file)

Future Enhancements

Add user authentication for private rooms.

Implement file-sharing functionality.

Improve UI/UX for better user experience.

Enhance error handling and connection stability.

License

This project is licensed under the MIT License. Feel free to use, modify, and distribute the code as needed.

Contributions

Contributions are welcome! If you'd like to contribute, please fork the repository and create a pull request with your changes.

Acknowledgments

WebRTC Documentation

Socket.IO Documentation

Inspiration from various WebRTC tutorials and projects.

Contact

For any questions or feedback, feel free to reach out:

Email: your-email@example.com

GitHub: your-username

Thank you for checking out the project! If you like it, give it a ⭐ on GitHub!
