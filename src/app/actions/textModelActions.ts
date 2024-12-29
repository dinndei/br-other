import axios from "axios";

const translateText = async (text: string): Promise<string> => {
    const apiKey = 'AIzaSyAtxMf9-PAkuWAHP7ApRhNA9UUOGGFZegg'; // ודא שזה מפתח API תקין
    const targetLanguage = 'en';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                target: targetLanguage,
            }),
        });
        const data = await response.json();
        return data.data.translations[0].translatedText;
    } catch (error) {
        console.error('Error in translation:', error);
        throw error;
    }
};

export const isToxic = async (text: string): Promise<boolean> => {
    try {
        // שליחת הטקסט לתרגום
        const translatedText = await translateText(text);

        // קריאה למודל ב-Hugging Face
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/FredZhang7/one-for-all-toxicity-v3',
            { inputs: translatedText },
            {
                headers: {
                    Authorization: `Bearer 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`,
                },
            }
        );

        // בדיקה אם הטקסט רעיל
        const predictions = response.data;
        if(predictions[0][0]["label"]=="LABEL_1")
            return true;
        return false;
        
        
        
        return true; // ערך סף לזיהוי רעילות (ניתן לשנות בהתאם לצורך)
    } catch (error) {
        if (error.response && error.response.status === 503) {
            console.log("Model loading, retrying in a few seconds");
            return new Promise((resolve) => {
                setTimeout(async () => {
                    resolve(await isToxic(text));
                },  2000);
            });
        } else {
            console.error("Error:", error);
            return false; // במקרה של שגיאה, מחזיר false
        }
    }
};
