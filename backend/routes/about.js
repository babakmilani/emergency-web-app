import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.render('about');
});

export default router;