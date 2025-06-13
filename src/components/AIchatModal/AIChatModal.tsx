import { Modal, Input, Button, List, Spin, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import { generateAIResponse } from "../../services/geminiService";
import { useTranslation } from "react-i18next";
import "./AIChatModal.css";

interface Message {
  text: string;
  sender: "user" | "ai";
}

interface AIChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  visible,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const aiResponse = await generateAIResponse(input);
      const aiMessage: Message = { text: aiResponse, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage: Message = { text: t("aiChat.error"), sender: "ai" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("aiChat.title")}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="ai-chat-modal"
    >
      <div className="chat-container">
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item
              className={`chat-message ${
                message.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              <Typography.Text>
                <strong>
                  {message.sender === "user" ? t("aiChat.you") : t("aiChat.ai")}
                  :
                </strong>{" "}
                {message.text}
              </Typography.Text>
            </List.Item>
          )}
        />
        {loading && <Spin style={{ display: "block", margin: "10px auto" }} />}
      </div>
      <div className="chat-input">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("aiChat.placeholder")}
          onPressEnter={handleSend}
          suffix={
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={loading}
            />
          }
        />
      </div>
    </Modal>
  );
};
