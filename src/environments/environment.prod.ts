const apiUrl = 'https://localhost:7012';  // Fixed apiUrl declaration

export const environment = {
    production: false,
    apiUrl: apiUrl,           // Added apiUrl here to reuse across the environment
    loginUrl: `${apiUrl}/login`,
    logoutUrl: `${apiUrl}/logout`,
    identityUrl: `${apiUrl}/identity`,
    registerUrl: `${apiUrl}/register`,
    updateUserUrl: `${apiUrl}/users`,
    jobcandidateUrl: `${apiUrl}/jobcandidate`,
    jobroleUrl: `${apiUrl}/jobrole`,
};
