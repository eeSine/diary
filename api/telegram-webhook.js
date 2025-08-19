// api/telegram-webhook.js
// 这个文件处理Telegram webhook并触发GitHub Actions

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        if (!message || !message.text) {
            return res.status(200).json({ ok: true });
        }

        // GitHub配置 - 需要在Vercel环境变量中设置
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  // GitHub Personal Access Token
        const GITHUB_OWNER = process.env.GITHUB_OWNER;  // 你的GitHub用户名
        const GITHUB_REPO = process.env.GITHUB_REPO;    // 日记仓库名

        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
            console.error('Missing GitHub configuration');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // 触发GitHub Actions
        const githubApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;
        
        const githubResponse = await fetch(githubApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_type: 'telegram-message',
                client_payload: {
                    text: message.text,
                    chat_id: message.chat.id,
                    message_id: message.message_id,
                    timestamp: new Date().toISOString()
                }
            })
        });

        if (!githubResponse.ok) {
            const errorText = await githubResponse.text();
            console.error('GitHub API error:', errorText);
            return res.status(500).json({ error: 'Failed to trigger GitHub Actions' });
        }

        console.log('Successfully triggered GitHub Actions');
        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error('Webhook处理错误:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
