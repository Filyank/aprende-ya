import React from "react";
import "./CourseList.css";
import { Component } from "react";
import axios from "axios";
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Rating, Tab, Tabs, Typography, TextField } from "@mui/material";

class CourseCard extends Component {
  render() {
    const {course} = this.props;
    return (
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={course.image}
            alt={course.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {course.title}
            </Typography>
            <Rating name="half-rating-read" defaultValue={course.rating | 0} precision={0.5} readOnly />
            <Typography variant="body1">
              {course.description}
            </Typography>
            <Typography variant="body1" className={"CourseList-price"}>
              ${course.price}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary" className={"CourseList-inscribirse-button"}>
            Inscribirse
          </Button>
        </CardActions>
      </Card>
    )
  }
}


class CourseList extends React.Component {
  state = {
    courses: [],
    category: 0,
    searchQuery: ''
  }

  componentDidMount() {
    axios.get('http://localhost:8000/courses')
      .then((response) => {
        this.setState({ courses: response.data });
      })
      .catch((error) => {
        console.error('Error fetching courses: ', error);
      });
  }

  handleTabChange = (event, newValue) => {
    this.setState({ category: newValue });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value.toLowerCase() });
  }

  render() {
    const { courses, category, searchQuery } = this.state;
    const filteredCourses = courses.filter(course =>
      (category === 5 ? true : course.category === category) &&
      course.title.toLowerCase().includes(searchQuery)
    );

    return (
      <Box className={"CourseList"}>
        <Typography variant={"h3"} className={"CourseList-title"}>Explora cursos</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={category} onChange={this.handleTabChange} textColor="black" indicatorColor="secondary">
            <Tab label="Programación" />
            <Tab label="Matemática" />
            <Tab label="Marketing" />
            <Tab label="Economía" />
            <Tab label="Arte" />
            <Tab label="Todos" />
          </Tabs>
          <TextField
            variant="outlined"
            placeholder="Buscar por título"
            onChange={this.handleSearchChange}
            size="small"
          />
        </Box>
        <Grid container spacing={5}>
          {filteredCourses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
}

export default CourseList;
