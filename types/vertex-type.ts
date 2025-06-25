import { createVertex } from '@ai-sdk/google-vertex';

const vertex = createVertex({
    project: 'anomsg',
    location: 'us-central1',
    googleAuthOptions: {
        credentials: {
            client_email: process.env.GOOGLE_VERTEX_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_VERTEX_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
    },
});

export default vertex;