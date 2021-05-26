import React, { useEffect, useState, Fragment } from 'react';
import Mura from 'mura.js';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import styles from './Sidebar.module.scss';

const Sidebar = (props) => {
  console.log('Component -> Text: ', props);
  const [items, setItems] = useState([]);
  const [orgs, setOrgs] = useState({});
  const [isCallComplete, setIsCallComplete] = useState(false);

  useEffect(async () => {
    await Mura.get(`${Mura.getAPIEndpoint()}/proxy/pipedrive2/`).then(
      (json) => {
        if (json.data) {
          console.log(json);
          const org = {};
          json.data.forEach((item) => {
            if (item.org_id && org[item.org_id.name] === undefined) {
              if (item.org_id) {
                org[item.org_id.name] = { deals: [item] };
              }
            } else {
              if (item.org_id) {
                org[item.org_id.name].deals.push(item);
              }
            }
          });
          console.log('org', JSON.stringify(org, 0, 4));
          setIsCallComplete(true);
          setOrgs(org);
        }
      },
    );
  }, []);

  return (
    <div className="flex-shrink-0 p-3 bg-white" style={{ width: 280 + 'px' }}>
      {isCallComplete && orgs && (
        <Accordion defaultActiveKey="0">
          {orgs &&
            Object.keys(orgs).map((key, i) => (
              <Card key={[key, '-', i].join()}>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey={i}>
                    {key}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={i}>
                  <Card.Body>
                    <ul>
                      {orgs[key] &&
                        orgs[key].deals &&
                        orgs[key].deals.map(({ title }, j) => (
                          <li key={[key, '-', i, '-', j].join()}>{title}</li>
                        ))}
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
        </Accordion>
      )}
    </div>
  );
};

export default Sidebar;
