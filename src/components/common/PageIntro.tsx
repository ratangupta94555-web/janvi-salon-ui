import React from 'react';
export type PageIntroProps={eyebrow:string;title:React.ReactNode;description?:string;className?:string};
export default function PageIntro({eyebrow,title,description,className=''}:PageIntroProps){return <section className={`inner-title ${className}`}><span className="page-kicker">{eyebrow}</span><h1>{title}</h1>{description&&<p>{description}</p>}</section>}
