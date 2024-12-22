import axios from "axios";

export default async function checkModelStatus(message:string) {
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/FredZhang7/one-for-all-toxicity-v3',
            { inputs:message },
            { headers: { Authorization: `Bearer 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` } }
        );

       if(response.data[0][0]["label"]=="LABEL_1")
        return "negetive" ;
    return "positive";

    }  catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 503) {
                console.log("Model loading, retrying...", error.response.data.estimated_time);
                setTimeout(checkModelStatus, error.response.data.estimated_time * 1000);
            } else {
                console.error("Axios error:", error.response?.data || error.message);
            }
        } else {
            console.error("Unexpected error:", error);
        }
    }
}