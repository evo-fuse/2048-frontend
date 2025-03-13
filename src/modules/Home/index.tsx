import { withHomeLayout } from "../../layout";
import { HomeView } from "./views";

export const HomePage: React.FC = withHomeLayout(() => <HomeView />);
