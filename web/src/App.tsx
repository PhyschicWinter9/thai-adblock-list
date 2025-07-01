import './App.css'
import Contribute from './components/Contribute'
import DownloadSubscribe from './components/DownloadSubscribe'
import Features from './components/Features'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import { I18nProvider } from './hooks/useI18n'
import { ThemeProvider } from './hooks/useTheme'

function App() {


  return (
     <ThemeProvider>
      <I18nProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-500">
          <Header />
          <main>
            <Hero />
            <Features />
            <Contribute />
            <DownloadSubscribe />
          </main>
          <Footer />
        </div>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
