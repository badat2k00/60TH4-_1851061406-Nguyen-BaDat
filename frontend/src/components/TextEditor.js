import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextEditor.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'align': [] }], // <-- Dòng này thêm chức năng căn lề (trái, phải, giữa, đều)
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ]
};
function TextEditor({onChange,value}) {
  // const [value, setValue] = useState('');

  return (
  <div className='mb-3'>
    <ReactQuill theme="snow"  value={value} onChange={onChange} className='my-quill' modules={modules}/>
    </div>
    )
}
export default TextEditor