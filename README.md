# Cadmus Europe

Cadmus Europe is an experiment, and a heavy WIP. There are no claims being made on accurary or viability. It aims to build a web application that provides summaries and analyses of European political programs and parliamentary sessions. It leverages AI to generate insights and comparisons between different political parties and their positions on various topics.

The motivation lies in lowering the threshold for understanding and interpreting political programs. Reading whole political programs can be overwhelming, daunting, and time-consuming. Getting a Summary neccessitates neutrality, which is not always guaranteeable with present-day LLMs. However, the initial results are promising, and we are eager to see how this experiment evolves.

## Project Structure

- `frontend/`: Contains the TypeScript-based frontend application using React, ShadCN, and TailwindCSS
- `main.go`: The main Go file for the backend server
- `handlers.go`: Contains the HTTP request handlers
- `utils.go`: Utility functions for the backend
- `example.app.yaml`: Configuration file for Google Cloud deployment 
- `deploy.sh`: Script for deploying the application to Google Cloud
- `run.sh`: Script for running the application locally

## Prerequisites

- Node.js 20 or later (21.7.3 at the time of writing)
- [Bun](https://bun.sh)
- Google Cloud SDK (Gcloud CLI)
- Firebase account and credentials
- Groq API key: [Groq Console](https://console.groq.com/keys)

## Setup

1. Clone the repository:
   
    git clone https://github.com/justinmiehle/cadmus-europe.git
    cd cadmus-europe
   

2. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
   
    GROQ_API_KEY=your_groq_api_key
    PORT=5001
   
    For the service account key, use:
   
    gcloud iam service-accounts keys create ./serviceAccountKey.json --iam-account=firestore-service-account@whatever.iam.gserviceaccount.com
   

3. Install backend dependencies:
   
    bun install
    bun run build
   

4. Set up the frontend:
   
    cd frontend
    bun install
   

## Running Locally

1. Copy the `example.env` file to `.env` and add your own API keys (for the backend).
2. Run the application:
   
    ./run.sh
   
    Note: You may need to make the script executable first: `chmod +x run.sh`

## Deploying the Application

1. Copy the `example.app.yaml` file to `app.yaml` and add your own GROQ API Key.
2. Deploy the application to Google Cloud:
   
    ./deploy.sh
   
    Note: 
    - You may need to make the script executable first: `chmod +x deploy.sh`
    - You may need to run `gcloud auth login` first if you're not authenticated.
    - This project does not include the `app.yaml` or `serviceaccountkey.json`, you will need to create them yourself.

## Development

- The frontend is built with TypeScript, React, ShadCN, and TailwindCSS.
- Code formatting is handled by Biome with default settings.

## Known Issues and Future Improvements

1. Instruction Adherence & Compliance: 
    - The AI prompts need refinement to improve instruction adherence.
    - Language switching requests are not always handled correctly.
    - Opening certain file formats (e.g., PDFs) can be problematic.

2. Documentation:
    - Improve documentation for setting up `app.yaml` and `serviceaccountkey.json`.
    - Add more detailed instructions for local development and testing.

3. Error Handling:
    - Implement more robust error handling and user feedback mechanisms.

4. Performance:
    - Optimize AI calling for faster response times, especially in the topic comparison.

5. User Interface:
    - Enhance the UI/UX based on user feedback and usability testing.

## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
