import axios from "axios";

const apiKey = process.env.OPENAI_API_KEY;
export const apiOpenAi = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
   }
})