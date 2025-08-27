import React from 'react'
import { Link } from 'react-router-dom'

function NewsSection() {
  return (
    <div>
      <div className='mb-20'>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">News Islamic</h2>
        <div>
          <Link to="/artikel-1" className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-left">
              <h3 className="text-sm font-medium text-gray-800">Cara memakai sorban</h3>
              <p className="text-gray-600 text-xs mt-0.5">deskripsi</p>
            </div>
            <div className="ml-auto text-gray-400">
              <i className="ri-arrow-right-s-line text-lg"></i>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NewsSection
