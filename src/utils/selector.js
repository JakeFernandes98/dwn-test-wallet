import React, { useState } from 'react';

const PermissionRequests = ({ permissions, handleAccept, handleReject }) => {
  const [selected, setSelected] = useState([]);

  console.log(permissions)
  if(permissions == undefined){
    return <></>
  }

  const toggleSelected = (index) => {
    if (selected.includes(index)) {
      setSelected((prevSelected) => prevSelected.filter(i => i !== index));
    } else {
      setSelected((prevSelected) => [...prevSelected, index]);
    }
  };

  const acceptSelected = () => {
    // Handle the accepted permissions
    const accepted = selected.map(i => permissions[i]);
    console.log('Accepted:', accepted);
    handleAccept(accepted)

    // You can also clear the selected or do further processing if needed
    setSelected([]);
  };

  const rejectSelected = () => {
    // Handle the rejected permissions
    const rejected = selected.map(i => permissions[i]);
    console.log('Rejected:', rejected);

    handleReject(rejected)

    setSelected([]);
  };

  const styles = {
    list: {
      listStyleType: 'none',
      padding: 0,
    },
    listItem: {
        border: '1px solid #e1e1e1',
        margin: '10px 0',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
    },
    checkbox: {
        display: 'block',
        marginRight: '10px',
    },
    button: {
      margin: '10px 5px',
      padding: '10px 20px',
      cursor: 'pointer',
    },
    detail: {
        position: 'relative',
        marginBottom: '5px'
      },
  };

  return (
    <div>
      <ul style={styles.list}>
        {permissions.map((permission, index) => (
          <li key={index} style={styles.listItem}>
            <input 
              type="checkbox"
              checked={selected.includes(index)}
              onChange={() => toggleSelected(index)}
              style={styles.checkbox}
            />
            <div style={styles.detail}>{`From: ${permission.descriptor.grantedTo}`}</div>
            <div style={styles.detail}>{`Method: ${permission.descriptor.scope.method}`}</div>
            <div style={styles.detail}>{`Schema: ${permission.descriptor.scope.schema}`}</div>
            <div style={styles.detail}>{`Date: ${permission.descriptor.dateCreated}`}</div>
          </li>
        ))}
      </ul>
      <button onClick={acceptSelected} style={styles.button}>Accept Selected</button>
      <button onClick={rejectSelected} style={styles.button}>Reject Selected</button>
    </div>
  );
};

export default PermissionRequests;

