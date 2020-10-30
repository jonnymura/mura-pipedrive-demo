import { useState } from "react";
import React from 'react';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from "react-markdown";
import CollectionNav from '../../../CollectionNav/CollectionNav';
import ItemDate from '../../../Utilities/ItemDate';
import CollectionReadMoreBtn from "@components/Utilities/CollectionReadMoreBtn";

/*
  The link component throws an error when rerending after being 
  reconfigured in edit mode. Hence CollectionLink
*/
const AlternatingBoxes = ({props,collection,link}) => {
  const [pos, setPos] = useState(0);
  return (
    <>
      <div className="collectionLayoutAlternatingBoxes">
          <CurrentItems collection={collection} pos={pos} link={link} {...props} /> 
      </div>
      <div className="row">
        <div className="col-12">
        <CollectionNav collection={collection} pos={pos} setPos={setPos} link={link} {...props} />
        </div>
      </div>
    </>
  )
}

const CurrentItems = (props) => {
  const {collection,nextn,link,pos,fields} = props;
  let itemsList = [];
  let item = '';
  const Link = link;
  const items = collection.get('items');
  const itemsTo = pos+nextn > items.length ? items.length : pos+nextn;
  const fieldlist = fields ? fields.toLowerCase().split(",") : [];
  // console.log(fieldlist);

  for(let i = pos;i < itemsTo;i++) {
    item = items[i];
    itemsList.push(

      <Card className="border-0" key={item.get('contentid')}>
        <div className="row no-gutters align-items-stretch">
          <div className={`col-12 col-md-6 ${i % 2 == 0 ? "card-img-left" : "card-img-right  order-md-2"}`}>
            <Card.Img variant="top" src={item.get('images').landscape} className="rounded-0" />
          </div>
          <div className="col-12 col-md-6 p-0">
            <Card.Body className="spacing-normal h-100">
              <div className="mura-item-meta">
                {
                fieldlist.map(field => {
                  switch(field) {
                    case "title":
                      return (
                        <Card.Title key={field}>{item.get('title')}</Card.Title>
                      )
                    case "date":
                        return (
                          <div className="mura-item-meta__date" key="date">
                            <ItemDate releasedate={item.get('releasedate')} lastupdate={item.get('lastupdate')}></ItemDate>
                          </div>
                        );
                    case "summary":
                      return <ReactMarkdown source={item.get('summary')} key={field} />
                    case "readmore":
                      return(
                        <CollectionReadMoreBtn
                          href={`/${item.get('filename')}`}
                          ctatext="Read More"
                          link={Link}
                          key={item.get('contentid')}
                        />
                      );
                    default:
                      return <div className={`mura-item-meta__${field}`} key={field} data-value={item.get(field)}>{item.get(field)}</div>
                  }        
                })
                }
              </div>
            </Card.Body>
          </div>
        </div>
      </Card>
    );
  }

  return itemsList;
}

/*
  This is not required; it is used to retrieve the required fields when populated getStatic/getServerSide props
*/
export const getQueryProps = () => {
  const data = {};
  data['fields'] = "title,summary";

  return data;
};

export default AlternatingBoxes;