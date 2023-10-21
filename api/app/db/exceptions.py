class EmailTakenException(Exception):
    def __init__(self):
        self.message = "Email is already taken"
        super().__init__(self.message)


class CourseNameTakenException(Exception):
    def __init__(self):
        self.message = "Course name is already taken"
        super().__init__(self.message)
