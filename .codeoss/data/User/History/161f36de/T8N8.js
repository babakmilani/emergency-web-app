//index.js route
import express from 'express';
const router = express.Router();
const encodingUrl = express.urlencoded({ extended: true });


router.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
    res.render('index');
});


export default router;