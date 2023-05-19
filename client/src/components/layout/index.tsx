import { Layout as AntLayout } from "antd";
import styles from "./index.module.css";

type Props = {
  children: React.ReactNode;
};
// export const Layout: React.FC<Props> = ({children}) - альтернативный вариант записи
export const Layout = ({ children }: Props) => {
  return <div className={styles.main}>
    <AntLayout.Content style={{height: '100%'}}>
    {children}
    </AntLayout.Content>
    </div>
};
