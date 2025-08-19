export async function analyzeVagueness(topic :string, userId: string, isBYOK:boolean){
    if (!userId) throw new Error('userId required');
    const res = await fetch(`/api/topic/analyze`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'x-user-id' : userId,
            'x-byok-mode': isBYOK? 'true': 'false'
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({topic})
    })

    if(!res.ok){
        let error = 'unknown';
        try{
            const j = await res.json(); error = j?.error || error;
        }catch{}

        if(res.status === 403 || res.status === 429){
            return {error}
        }
        return {error: 'network'}
    }
    return res.json();
}