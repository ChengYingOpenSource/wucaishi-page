import React from 'react';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const Title = (props) => {
  return (
    <div className="title">
      <div>
        <Link to={'/home'}><HomeOutlined /><span className="pl10">首页</span></Link>
      </div>
      {(props.path || []).map((it, index) => {
        return (
          <div key={index}>
            {it.path ? <Link to={it.path}>{it.name}</Link> : <span>{it.name}</span>}
          </div>
        )
      })}
    </div>
  )
};

export default Title;
