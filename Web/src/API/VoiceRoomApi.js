const apiUrl = 'https://localhost:5001';

const createUrl = apiUrl + '/VoiceRoom/Create';

class VoiceRoomAPI {
    static async createVoiceRoomId() {
        const res = await fetch(createUrl);
        return await res.text();
    }
}
export default VoiceRoomAPI;