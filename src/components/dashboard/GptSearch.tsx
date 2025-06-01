import React, { useState } from "react";
import { Input, Spin } from "antd";
import { askGpt } from "../../services/openaiService";

const { Search } = Input;

const GptSearch = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");

  const handleSearch = async (value: string) => {
    setLoading(true);
    try {
      const reply = await askGpt(value);
      setAnswer(reply);
    } catch (error) {
      setAnswer("❌ Ошибка при запросе к GPT");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <Search
        placeholder="Ask GPT a question..."
        enterButton="Ask"
        size="large"
        onSearch={handleSearch}
        loading={loading}
        aria-label="GPT Search"
      />
      <div style={{ marginTop: 20 }}>
        {loading ? <Spin /> : <pre>{answer}</pre>}
      </div>
    </div>
  );
};

export default GptSearch;
