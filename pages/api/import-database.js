
export default function handler(req, res) {
    if (req.method === 'POST') {
        importDatabase(req, res);
    }
}

const importDatabase = (req, res) => {
    res.status(200).json({ name: 'Database Import' });
}

