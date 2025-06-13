import { Card, Col, Row, Typography, Divider, Space } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const developers = [
  { name: "Shushan Grigoryan" },
  { name: "Tigran Aslanyan" },
  { name: "Vahe Avetisyan" },
  { name: "Arsen Avetyan" },
  { name: "Hamlet Darmoyan" },
  { name: "Koryun Baghdasaryan" },
];

export const AboutUsContainer = () => {
  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Title level={2}>{t("about.title") || "About Us"}</Title>
      <Title level={4}>🌱{t("about.mission")}</Title>
      <Paragraph>
        {t("about.description")}
      </Paragraph>

      <Divider orientation="left">👨‍💻{t("about.team") || "Our Team"}</Divider>
      <Paragraph>
        {t("about.teamdesc")}
      </Paragraph>

      <Row gutter={[16, 16]}>
        {developers.map((dev) => (
          <Col xs={24} sm={12} md={8} key={dev.name}>
            <Card bordered hoverable style={{ textAlign: "center" }}>
              <Title level={4}>{dev.name}</Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider orientation="left">⚙️{t("about.technologies") || "Technologies Used"}</Divider>
      <Space direction="vertical">
        <Text>• React + TypeScript</Text>
        <Text>• Redux Toolkit</Text>
        <Text>• Ant Design</Text>
        <Text>• Recharts</Text>
        <Text>• React Router</Text>
        <Text>• i18n internationalization</Text>
      </Space>
    </div>
  );
}