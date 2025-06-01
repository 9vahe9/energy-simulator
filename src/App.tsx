import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
//import ThreeScene from "./components/ThreeScene/SceneContainer";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
