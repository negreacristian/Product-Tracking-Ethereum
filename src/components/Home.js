import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();

  function handleLogin() {
    navigate('/login');
  }

  return (
    <div>
      <Header handleLogin={handleLogin} />
      <Content />
      <Footer />
    </div>
  );
};

export default Home;
