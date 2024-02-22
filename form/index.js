import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './hail.css';
import ReactTooltip from 'react-tooltip';
import SwitchControl from './SwitchControl';
import { isSite } from '../layout/criteria';
import { useCriteriaContext } from '../../context/criteria.context';
import { getSites } from '../../model/metadata';
import { IoAddCircleOutline } from 'react-icons/io5';
import AddHailForm from './addSite';
import { getUserID, isAdminUser } from "../auth/userinfo";
import { GetFQURL, postJSONData } from "../model/store.swr";
import { Toast } from 'react-bootstrap';
import styled from 'styled-components'


const Error = styled.span`
  padding: 0px;
  padding-top: 30px;
  color: red;
`;

const HailSettings = () => {
  const [editable, setEditable] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const criteria = useCriteriaContext();
  const siteValue = isSite(criteria) ? criteria.site : null;
  const [sites, setSites] = useState(null); 
  const criteriaContext = useCriteriaContext();
  const [latitudeValue, setLatitudeValue] = useState(''); 
  const [longitudeValue, setLongitudeValue] = useState(''); 
  const [editedHailEnabled, setEditedHailEnabled] = useState(false);
  const [editedHailNotificationEnabled, setEditedHailNotificationEnabled] = useState(false);
  const [editedHailProbability, setEditedHailProbability] = useState('');
  const [editedHailSize, setEditedHailSize] = useState('');
  const [editedSiteRadius, setEditedSiteRadius] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const setInitialValues = () => {
      if (editable && criteriaContext.site && sites === null) {
        getSites(criteriaContext, (data) => {
          console.log('Data received:', data);
          setSites(data && data.length > 0 ? data : []);
        });
      }
  
      if (criteriaContext.site && sites !== null) {
        const selectedSite = sites.find((site) => site.site_id === siteValue);
        // console.log('Selected Site:', selectedSite);
  
        if (selectedSite) {
          setLatitudeValue(selectedSite.latitude || '');
          setLongitudeValue(selectedSite.longitude || '');
          setEditedHailEnabled(selectedSite.hail_enabled !== null ? selectedSite.hail_enabled : false);
          setEditedHailNotificationEnabled(selectedSite.hail_notification_enabled !== null ? selectedSite.hail_notification_enabled : false);
  
          if (selectedSite.hail_threshold) {
            try {
              const parsedThreshold = JSON.parse(selectedSite.hail_threshold);
              setEditedHailProbability(parsedThreshold.hail_probability || '');
              setEditedHailSize(parsedThreshold.hail_size || '');
              setEditedSiteRadius(parsedThreshold.site_radius || '');
            } catch (error) {
              console.error('Error parsing hail_threshold:', error.message);
            }
          } else {
            setEditedHailProbability('');
            setEditedHailSize('');
            setEditedSiteRadius('');
          }
        }
      }
    };
  
    setInitialValues();
  }, [editable, criteriaContext.site, sites, siteValue]);
  
  
  
  useEffect(() => {
    if (!latitudeValue || !longitudeValue) {
      setDisableInputs(true);
    } else {
      setDisableInputs(false);
      setErrorMessage(''); 
    }
  }, [latitudeValue, longitudeValue]);
  
  
  const handleToggle1 = () => {
    if (editable && !disableInputs) {
      setEditedHailNotificationEnabled(!editedHailNotificationEnabled);
      setUnsavedChanges(true);
    } else if (!isAdminUser()) {
      setErrorMessage("Feature cannot be enabled as required mandatory fields are missing. Please contact FTC Admin to fill the mandatory fields.");
    } else if (isAdminUser()) {
      setErrorMessage("Feature cannot be enabled as required mandatory fields are missing.");
    };
 }
  
  const handleToggle2 = () => {
    if (editable && !disableInputs) {
      setEditedHailEnabled(!editedHailEnabled);
      setUnsavedChanges(true);
    } else if (!isAdminUser()) {
      setErrorMessage("Feature cannot be enabled as required mandatory fields are missing.Please contact FTC Admin to fill the mandatory fields.");
    } else if (isAdminUser()) {
      setErrorMessage("Feature cannot be enabled as required mandatory fields are missing.");
  };
}
  

  const handleInputChange = (e) => {
    if (editable) {
      const { name, value } = e.target;

      const latitudeString = String(latitudeValue);
      const longitudeString = String(longitudeValue);
  
      if (isAdminUser() && (['field4', 'field5', 'field6'].includes(name)) && (!latitudeString.trim() || !longitudeString.trim())) {
        setErrorMessage("Feature cannot be enabled as required mandatory fields are missing.");
        return;
      }
      
      switch (name) {
        case 'field2':
          setLatitudeValue(value);
          break;
        case 'field3':
          setLongitudeValue(value);
          break;
        default:
          if (!disableInputs) {
            switch (name) {
              case 'field4':
                setEditedHailSize(value);
                break;
              case 'field5':
                setEditedHailProbability(value);
                break;
              case 'field6':
                setEditedSiteRadius(value);
                break;
              default:
                break;
            }
            setUnsavedChanges(true);
          } else if (!isAdminUser()) {
            setErrorMessage("Feature cannot be enabled as required mandatory fields are missing.Please contact FTC Admin to fill the mandatory fields.");
          }
          break;
      }
      setUnsavedChanges(true);
    }
  };
  

  const handleOk = () => {
    setToggle1(editedHailEnabled);
    setToggle2(editedHailNotificationEnabled);

    const postData = {
        siteValue,
        editedHailEnabled,
        editedHailNotificationEnabled,
        editedHailProbability,
        editedHailSize,
        editedSiteRadius,
        latitudeValue, 
        longitudeValue,
    };
    console.log('Data submitted:', postData);
    const apiUrl = "/meta?querytype=meta_sites_hail_update"; 
    postJSONData(apiUrl, postData, (response) => {
        console.log('Server response:', response);

        getSites(
          criteriaContext,
          (data) => {
            console.log('Data received:', data);
            setSites(data && data.length > 0 ? data : []);
          },
        );
        handleSuccessfulResponse(response);

        setUnsavedChanges(false);
        setEditable(true);
    });
};
const handleSuccessfulResponse = (response) => {
};


  const handleCancel = () => {
    console.log('Form canceled');
    setEditable(true);
    getSites(
      criteriaContext,
      (data) => {
        console.log('Data received:', data);
        setSites(data && data.length > 0 ? data : []);
      },
    );
    setUnsavedChanges(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancelAddForm = () => {
    setShowAddForm(false);
  };

  const handleAddFormSubmit = (formData) => {
    console.log('Submitted data:', formData);
    const apiUrl = "/meta?querytype=meta_sites_hail_form";
    postJSONData(apiUrl, formData, (response) => {
      console.log('Server response:', response);
      getSites(
        criteriaContext,
        (data) => {
          console.log('Data received:', data);
          setSites(data && data.length > 0 ? data : []);
        },
      );
      handleSuccessfulResponse(response);
    });
  };

  return (
    <div className="col-8 col-xl-5 pl-0" style={{ width: 'calc(100% - 20px)' }}>
            {showAddForm ? (
        <AddHailForm onCancel={handleCancelAddForm} onSubmit={handleAddFormSubmit} />
        ) : (
      <div className="chart-card1">
        <div className="chart-card-header1">
          <h5 style={{ fontWeight: 600, fontSize: '18px', lineHeight: '15px', color: 'rgb(76, 67, 69)', padding: '10px 0px 10px 6px' }}>
            Hail Event Settings for "{siteValue}"
          </h5>
        </div>
        <Row>
          <Col md={10}></Col>
          <Col md={2} className={isAdminUser() ? 'col-padding' : 'col-padding-right'}>
              {isAdminUser() && (
                <span
                  className="tooltip-icon"
                  data-tip="<div class='tooltip-content'><b>Add Site</b></div>"
                  data-html={true}
                  data-place="left"
                  onClick={handleAddClick}
                >
                  <IoAddCircleOutline size={25} />
                </span>
              )}
            <span
              className="tooltip-icon"
              data-tip="<div class='tooltip-content'><b>IMPORTANT:</b><br />In order to automatically stow FTC trackers based on these notifications, <br/>the Auto Hail Stow setting must be toggled ON. <br/>If the customer's preference is to not stow automatically based on these notifications, <br/>then the Auto Hail Stow setting should be toggled OFF.</div>"
              data-html={true}
              data-place="right"
            >
              <img
                src="../assets/img/icon/icon-info.svg"
                width="20"
                height="20"
                size={31}
                alt="Info"
              />
            </span>
            <ReactTooltip effect="solid" />
          </Col>
        </Row>
        <Row></Row>
        <Row>
        <Col md={12}>
              {errorMessage && <Error>{errorMessage}</Error>}
        </Col>
        </Row>
        <Row></Row>

        <Row className="d-flex align-items-center">
            <Col md={7}>
              <label className="card-title">Latitude<span style={{ color: 'red' }}>*</span></label>
            </Col>
            <Col md={5}>
              {isAdminUser() ? (
                <Form.Control
                  type="number"
                  name="field2"
                  value={latitudeValue}
                  onChange={handleInputChange}
                  disabled={!editable}                  
                  style={{
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px',
                    paddingRight: '48px',
                  }}
                />
              ) : (
                latitudeValue ? (
                  <label className="card-title"><b>{latitudeValue}</b> degree</label>
                ) : (
                  <label className="card-title">Not Available</label>
                )
              )}
              {isAdminUser() && <div className="unit">degree</div>}
            </Col>
          </Row>

          <Row className="d-flex align-items-center">
            <Col md={7}>
              <label className="card-title">Longitude<span style={{ color: 'red' }}>*</span></label>
            </Col>
            <Col md={5}>
              {isAdminUser() ? (
                <Form.Control
                  type="number"
                  name="field3"
                  value={longitudeValue}
                  onChange={handleInputChange}
                  disabled={!editable}                  
                  style={{
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px',
                    paddingRight: '48px',
                  }}
                />
              ) : (
                longitudeValue ? (
                  <label className="card-title"><b>{longitudeValue}</b> degree</label>
                ) : (
                  <label className="card-title">Not Available</label>
                )
              )}
              {isAdminUser() && <div className="unit">degree</div>}
            </Col>
          </Row>

             
                <Row className="d-flex align-items-center">
          <Col md={7}>
            <label className="card-title">Send Hail Event Notifications</label>
          </Col>
          <Col md={5}>
            <SwitchControl
              value={editedHailNotificationEnabled}
              handleChange={handleToggle1}
              disabled={!editable}
              />
          </Col>
        </Row>

        <Row className="d-flex align-items-center">
          <Col md={7}>
            <label className="card-title">Auto Hail Stow</label>
          </Col>
          <Col md={5}>
            <SwitchControl
              value={editedHailEnabled}
              handleChange={handleToggle2}
              disabled={!editable}
              />
          </Col>
        </Row>

        <Row className="d-flex align-items-center">
          <Col md={12}>
            <label className="mb-3 chart-card-header"><b>Hail Event Thresholds:</b></label>
          </Col>
        </Row>

        <Row className="d-flex align-items-center">
          <Col md={7}>
            <label className="card-title">Hail Size</label>
          </Col>
          <Col md={5}>
            <Form.Control
              type="number"
              name="field4"
              value={editedHailSize}
              onChange={handleInputChange}
              disabled={!editable}
              min="0"
              style={{
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                paddingRight: '48px',
              }}
            />
            <div className="unit">Inches</div>
          </Col>
        </Row>

        <Row className="d-flex align-items-center">
          <Col md={7}>
            <label className="card-title">Hail Probability</label>
          </Col>
          <Col md={5}>
            <Form.Control
              type="number"
              name="field5"
              value={editedHailProbability}
              onChange={handleInputChange}
              disabled={!editable}
              min="0"
              style={{
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                paddingRight: '26px',
              }}
            />
            <div className="unit">%</div>
          </Col>
        </Row>

        <Row className="d-flex align-items-center">
          <Col md={7}>
            <label className="card-title">Site Radius</label>
          </Col>
          <Col md={5}>
            <Form.Control
              type="number"
              name="field6"
              value={editedSiteRadius}
              onChange={handleInputChange}
              disabled={!editable}
              min="0"
              style={{
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                paddingRight: '45px',
              }}
            />
            <div className="unit">miles</div>
          </Col>
        </Row>
        <Row></Row>
        <Row></Row>
        <Row className="d-flex align-items-center">
          <Col md={7}></Col>
          <Col md={5}>
            <Button 
            className="btn-secondary" 
            onClick={handleOk} 
            style={{ width: '47%' }}
            disabled={disableInputs || !unsavedChanges}
            >
              Ok
            </Button>
            <Button 
            className="btn-secondary" 
            style={{ width: '47%', marginLeft: '11px' }} 
            onClick={handleCancel}
            disabled={!unsavedChanges}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
      )}
    </div>
  );
};

export default HailSettings;
