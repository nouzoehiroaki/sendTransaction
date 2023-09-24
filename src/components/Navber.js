import React from 'react'

const Navber = () => {
  return (
    <nav>
        <div className='logo'>
            <h2>Blockchains</h2>
        </div>
        <ul className='navLinks'>
            <li>マーケット</li>
            <li>交換</li>
            <li>ブロックチェーン</li>
            <li>ウォレット</li>
        </ul>
        <button>ログイン</button>
    </nav>
  )
}

export default Navber