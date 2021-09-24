
import { useEffect, useState } from 'react';
export default function Collapseable({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);
  return (<>
    <style jsx>{`
  .collapse-container{
    background-color:#333333;
  }
  .collapse-item{
    cursor:pointer; 
    color:#CE8500;
  }
  .collapse-body-text{
    color:#878787;
  }
  `}</style>
    <div className={`text-capitalize my-3 border border-white rounded p-3 collapse-container`}>
      <div className={`collapse-item`} onClick={() => setIsOpen(!isOpen)}>{title}</div>
      {isOpen && <p className={`mt-3 collapse-body-text`}><hr />{content}<hr /></p>}

    </div>
  </>)
}