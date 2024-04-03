import React, { useState , useEffect} from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './hail.css';
import ReactTooltip from 'react-tooltip';
import SwitchControl from './SwitchControl';


const AddHailForm = ({ onCancel, onSubmit}) => {
  const [editable, setEditable] = useState(true);
  const [hail_notification, setHailNotification] = useState(false);
  const [hail_enabled, setHailEnabled] = useState(false)
  

  const user = getUser();
  const userName = user && user.name;

  const [data, setData] = useState({
    siteId: '',
    Latitude: '',
    Longitude: '',
    HailSize: '',
    HailProbability: '',
    SiteRadius: '',
    hail_notification: false,
    hail_enabled: false,
    updatedBy: userName
  });
  
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    const hasChanges =
      data.siteId.trim() !== '' &&
      data.Latitude.trim() !== '' &&
      data.Longitude.trim() !== '' 
    setUnsavedChanges(hasChanges);
  }, [data.siteId, data.Latitude, data.Longitude]);
  

  const handleHailNotificationToggle = () => {
    if (editable) {
      setHailNotification(!hail_notification);
      setData((prevData) => ({
        ...prevData,
        hail_notification: !prevData.hail_notification,
      }));
    }
  };

  const handleHailEnabledToggle = () => {
    if (editable) {
      setHailEnabled(!hail_enabled);
      setData((prevData) => ({
        ...prevData,
        hail_enabled: !prevData.hail_enabled,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };  

  const handleAddFormSubmit = () => {
    onSubmit(data);
    setUnsavedChanges(false);
    onCancel();
  };

  return (
    <div className="chart-card1">
      <div className="chart-card-header1">
        <h5 style={{ fontWeight: 600, fontSize: '18px', lineHeight: '15px', color: 'rgb(76, 67, 69)', padding: '10px 0px 10px 6px' }}>
          Hail Event Settings
        </h5>
      </div>
      <Row>
        <Col md={11}></Col>
        <Col md={1}>
          <span
            className="tooltip-icon"
            data-tip="<div><b>IMPORTANT:</b><br />In order to automatically stow FTC trackers based on these notifications, <br/>the Auto Hail Stow setting must be toggled ON. <br/>If the customer's preference is to not stow automatically based on these notifications, <br/>then the Auto Hail Stow setting should be toggled OFF.</div>"
            data-html={true}
            data-place="right"
          >
            <img
              src="../assets/img/icon/icon-info.svg"
              width="20"
              height="20"
              size={28}
              alt="Info"
            />
          </span>
          <ReactTooltip effect="solid" />
        </Col>
      </Row>

      <Row className="d-flex align-items-center">
        <Col md={7}>
          <label className="card-title">SiteID<span style={{ color: 'red' }}>*</span></label>
        </Col>
        <Col md={5}>
          <Form.Control
            type="text"
            name="siteId"
            value={data.siteId}
            onChange={handleInputChange}
            disabled={!editable}
            style={{
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
            }}
          />
        </Col>
      </Row>

      <Row className="d-flex align-items-center">
        <Col md={7}>
          <label className="card-title">Latitude<span style={{ color: 'red' }}>*</span></label>
        </Col>
        <Col md={5}>
          <Form.Control
            type="number"
            name="Latitude"
            value={data.Latitude}
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
          <div className="unit">degree</div>
        </Col>
      </Row>

      <Row className="d-flex align-items-center">
        <Col md={7}>
          <label className="card-title">Longitude<span style={{ color: 'red' }}>*</span></label>
        </Col>
        <Col md={5}>
          <Form.Control
            type="number"
            name="Longitude"
            value={data.Longitude}
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
          <div className="unit">degree</div>
        </Col>
      </Row>

      <Row className="d-flex align-items-center">
        <Col md={7}>
          <label className="card-title">Send Hail Event Notifications</label>
        </Col>
        <Col md={5}>
        <SwitchControl
            value={hail_notification}
            handleChange={handleHailNotificationToggle}
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
            value={hail_enabled}
            handleChange={handleHailEnabledToggle}
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
            name="HailSize"
            value={data.HailSize}
            onChange={handleInputChange}
            disabled={!editable}
            min="0"
            style={{
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              paddingRight: '46px',
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
            name="HailProbability"
            value={data.HailProbability}
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
            name="SiteRadius"
            value={data.SiteRadius}
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
          <Button className="btn-secondary" onClick={handleAddFormSubmit} style={{ width: '47%' }} disabled={!unsavedChanges}>
            Submit
          </Button>
          <Button className="btn-secondary" style={{ width: '47%', marginLeft: '11px' }} onClick={onCancel}>
            Cancel
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AddHailForm;
