const CLIENT_ID = "781881005174-se7adpep5eq7lq22sitl28f99jgc5njk.apps.googleusercontent.com";
const REDIRECT_URI = `${__API_URL__}/auth/callback`;

export const GOOGLE_OAUTH_REDIRECT_URL = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email%20profile&access_type=offline`;
