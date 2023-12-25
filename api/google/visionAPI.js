import vision from '@google-cloud/vision'
import dotenv from 'dotenv'
dotenv.config()

const CREDENTIALS = JSON.parse(JSON.stringify({
    "type": "service_account",
    "project_id": "fundamental-rig-409009",
    "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
    "private_key": process.env.GOOGLE_PRIVATE_KEY,
    "client_email": "compute-engine@fundamental-rig-409009.iam.gserviceaccount.com",
    "client_id": "110395639862762666713",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/compute-engine%40fundamental-rig-409009.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}))

const CONFIG = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email,
    }
}

export const client = new vision.ImageAnnotatorClient(CONFIG)