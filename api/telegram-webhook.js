// api/telegram-webhook.js
export default async function handler(req, res) {
    console.log('=== Webhook 请求开始 ===');
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    if (req.method !== 'POST') {
        console.log('错误: 不是POST请求');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('请求体:', JSON.stringify(req.body, null, 2));
        const { message } = req.body;
        
        if (!message) {
            console.log('没有消息对象');
            return res.status(200).json({ ok: true });
        }
        
        if (!message.text) {
            console.log('没有文本内容');
            return res.status(200).json({ ok: true });
        }

        console.log('收到消息:', message.text);
        console.log('Chat ID:', message.chat.id);

        // GitHub配置检查
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER = process.env.GITHUB_OWNER;
        const GITHUB_REPO = process.env.GITHUB_REPO;
        
        console.log('GitHub配置检查:');
        console.log('- GITHUB_OWNER:', GITHUB_OWNER ? '已设置' : '未设置');
        console.log('- GITHUB_REPO:', GITHUB_REPO ? '已设置' : '未设置');
        console.log('- GITHUB_TOKEN:', GITHUB_TOKEN ? '已设置' : '未设置');

        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
            console.error('GitHub配置缺失');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // 构建GitHub API请求
        const githubApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/dispatches`;
        console.log('GitHub API URL:', githubApiUrl);
        
        const payload = {
            event_type: 'telegram-message',
            client_payload: {
                text: message.text,
                chat_id: message.chat.id,
                message_id: message.message_id,
                timestamp: new Date().toISOString()
            }
        };
        
        // 检查文本编码
        console.log('原始文本:', JSON.stringify(message.text));
        console.log('文本字符数:', message.text.length);
        
        console.log('发送到GitHub的payload:', JSON.stringify(payload, null, 2));

        const githubResponse = await fetch(githubApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Telegram-Diary-Bot'
            },
            body: JSON.stringify(payload)
        });

        console.log('GitHub响应状态:', githubResponse.status);
        console.log('GitHub响应头:', JSON.stringify([...githubResponse.headers.entries()], null, 2));

        if (!githubResponse.ok) {
            const errorText = await githubResponse.text();
            console.error('GitHub API错误:', errorText);
            return res.status(500).json({ 
                error: 'Failed to trigger GitHub Actions',
                details: errorText
            });
        }

        const responseText = await githubResponse.text();
        console.log('GitHub响应内容:', responseText);
        console.log('✅ 成功触发GitHub Actions');
        
        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error('❌ Webhook处理错误:', error);
        console.error('错误堆栈:', error.stack);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        });
    }
}
