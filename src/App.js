import React from 'react'
import Home from './Home'
import NewPost from './NewPost'
import PostPage from './PostPage'
import About from './About'
import Layout from './Layout'
import Missing from './Missing'
import EditPost from './EditPost'
import { Route, Routes } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
const App = () => {
  return (
    <div className="App">

      <DataProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            {/* Nested routing for 'post' */}
            <Route path='post'>
              <Route index element={<NewPost />} />
              <Route path=':id' element={<PostPage />} />
            </Route>
            <Route path='edit/:id' element={<EditPost />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<Missing />} />
          </Route>
        </Routes>
      </DataProvider>

    </div>

  )
}

export default App