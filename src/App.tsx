import React,{useEffect,useState} from 'react';
import AdminDashboard from './components/Admin/AdminDashboard';
import PublicLayout from './components/layouts/PublicLayout';
import LandingPage from './pages/LandingPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';

function App(){
  const normalizePath=(pathname:string)=>pathname.replace(/\/+$/,'')||'/';
  const [path,setPath]=useState(()=>normalizePath(window.location.pathname));
  useEffect(()=>{const onPop=()=>setPath(normalizePath(window.location.pathname));window.addEventListener('popstate',onPop);return()=>window.removeEventListener('popstate',onPop)},[]);
  const navigate=(to:string)=>{window.history.pushState({},'',to);setPath(normalizePath(to))};
  if(path==='/admin'||path.startsWith('/admin/'))return <AdminDashboard/>;
  const pageProps={navigate};
  let page:React.ReactNode;
  switch(path){case '/appointments':page=<AppointmentsPage {...pageProps}/>;break;case '/about':page=<AboutPage {...pageProps}/>;break;case '/services':page=<ServicesPage {...pageProps}/>;break;case '/gallery':page=<GalleryPage {...pageProps}/>;break;case '/contact':page=<ContactPage {...pageProps}/>;break;case '/faq':page=<FAQPage {...pageProps}/>;break;default:page=<LandingPage {...pageProps}/>;}
  return <PublicLayout path={path} navigate={navigate}>{page}</PublicLayout>;
}
export default App;
