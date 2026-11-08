import { model } from "./firebase";

async function grabInfo(promptText) {
  const result = await model.generateContent(promptText);
  console.log(result.response.text());
}
