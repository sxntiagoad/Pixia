import axios from 'axios';
import { API_REMOVE_BG } from '../config.js';

export const removeBackground = async (req, res) => {
    try {
        const {image} = req.body;
        if(!image){
            return res.status(400).json({message: 'Image is required'});
        }

        const cleanBase64 = image.replace(/^data:image\/[a-z]+;base64,/, '');
        const removeBgResponse = await axios.post(API_REMOVE_BG, {image: cleanBase64}, {headers: {'Content-Type': 'application/json'}});
        

        if (removeBgResponse.data && removeBgResponse.data.result){
            const finalImageUrl = `data:image/png;base64,${removeBgResponse.data.result}`;
            return res.json({result: finalImageUrl});
        } else{
            return res.status(500).json({message: 'Error al procesar la imagen'});
        }
    } catch (error) {console.error('Error al remover el fondo:', error);
    return res.status(500).json({ error: `Error al procesar la imagen: ${error.message}` });
}
}