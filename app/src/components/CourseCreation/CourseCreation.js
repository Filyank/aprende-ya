import React, { useState } from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    Container,
    Paper,
    ListItemText,
    ListItem, List, IconButton, ListItemSecondaryAction, InputAdornment, Select, MenuItem
} from '@mui/material';
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import {useNavigate} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MultipleChoiceBuilder from "../MultipleChoiceBuilder/MultipleChoiceBuilder";

const steps = ['Título', 'Descripción', 'Contenido', 'Imagen', 'Examen'];

const CourseCreation = ({isUserLoggedIn}) => {
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category: 0,
        image: '',
        exam: '',
        price: 0
    });
    const [materialLink, setMaterialLink] = useState('');
    const [materials, setMaterials] = useState([]);
    const [exam, setExam] = useState([])

    const handleAddMaterial = () => {
        if (materialLink) {
            setMaterials([...materials, materialLink]);
            setMaterialLink(''); // Limpiar el input después de agregar el enlace
        }
    };

    const handleDeleteMaterial = (index) => {
        const updatedMaterials = materials.filter((_, i) => i !== index);
        setMaterials(updatedMaterials);
    };

    const handleSubmit = () => {
        const apiUrl = 'http://localhost:8000/course';

        setCourseData({ ...courseData, exam: JSON.stringify(exam) })
        console.log(courseData)

        axios
            .post(apiUrl, courseData, {withCredentials: true})
            .then((response) => {
                console.log('Create course:', response.data);
                navigate('/');
            })
            .catch((error) => {
                console.error('Error trying to create a new course:', error);
            });
    };

    const handleNext = () => {
        console.log(activeStep)
        if (activeStep === (steps.length - 1)) {
            handleSubmit()
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCourseData({...courseData, [name]: value});
    };

    const getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return (
                    <TextField
                        style={{marginTop: "15%"}}
                        fullWidth
                        label="Título del Curso"
                        value={courseData.title}
                        onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    />
                );
            case 1:
                return (
                    <Container>
                        <TextField
                            style={{marginTop: "15%"}}
                            fullWidth
                            label="Descripción del Curso"
                            value={courseData.description}
                            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                            multiline
                            rows={5}
                        />
                        <Select
                            fullWidth
                            value={courseData.category}
                            name={'category'}
                            onChange={handleInputChange}
                            style={{marginTop: '20px'}}
                        >
                            <MenuItem value={0}>Programación</MenuItem>
                            <MenuItem value={1}>Matemática</MenuItem>
                            <MenuItem value={2}>Marketing</MenuItem>
                            <MenuItem value={3}>Economía</MenuItem>
                            <MenuItem value={4}>Arte</MenuItem>
                        </Select>
                        <TextField
                            fullWidth
                            label="Precio"
                            name="price"
                            value={courseData.price}
                            onChange={handleInputChange}
                            style={{marginTop: '20px'}}
                        />
                    </Container>
                );
            case 2:
                return (
                    <div>
                        <TextField
                            style={{marginTop: "15%"}}
                            label="Enlace del Material"
                            value={materialLink}
                            onChange={(e) => setMaterialLink(e.target.value)}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button variant="contained" color="primary" onClick={handleAddMaterial} startIcon={<AddIcon />}>
                                            Agregar
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <List>
                            {materials.map((material, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={material} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => handleDeleteMaterial(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                );
            case 3:
                return (
                    <TextField
                        style={{marginTop: "15%"}}
                        fullWidth
                        label="Enlace de la imagen"
                        value={courseData.image}
                        onChange={(e) => setCourseData({ ...courseData, image: e.target.value })}
                    />
                );
            case 4:
                return (
                    <MultipleChoiceBuilder courseData={courseData} setCourseData={setCourseData}/>
                );
            // ... otros pasos del formulario
            default:
                return 'Paso no válido';
        }
    };

    return (
        <Container>
            <Paper
                style={{paddingTop: '100px'}}
                elevation={0}
                sx={{
                    p: 2,
                    margin: 'auto',
                    maxWidth: '70%',
                    flexGrow: 1,
                }}
            >
                <NavBar isUserLoggedIn={isUserLoggedIn}/>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>
            <Container>
                {activeStep === steps.length ? (
                    <Container>
                        <Typography variant="h5">¡Curso creado!</Typography>
                        {/* Aquí puedes mostrar un resumen del curso */}
                    </Container>
                ) : (
                    <Container>
                        <Typography>{getStepContent(activeStep)}</Typography>
                        <Container style={{ display: 'flex', flexDirection: 'column', marginTop: '30px' }}>
                            <Button disabled={activeStep === 0} onClick={handleBack} style={{ marginTop: 'auto' }}>Atrás</Button>
                            <Button variant="contained" color="primary" onClick={handleNext} style={{ marginBottom: '20px' }}>
                                {activeStep === steps.length - 1 ? 'Crear Curso' : 'Siguiente'}
                            </Button>
                        </Container>
                    </Container>
                )}
            </Container>
        </Container>
    );
};

export default CourseCreation;