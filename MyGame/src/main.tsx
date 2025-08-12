import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SpriteSheetLoader } from './Game/Animation/SpriteLoader.ts';


SpriteSheetLoader.loadAllSpriteSheets().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}).catch((err) => {
  console.log(err);
})
