import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
// import { LoginContainer } from "./components/login/LoginContainer";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
