const bcrypt = require('bcrypt')

bcrypt
  .compare(
    '12345',
    '$2b$04$w6HwWvSVRWRnCUtvpGrVJ.F7WkmfmlreiMNY0coiyXj1w6OwNkHq'
  )
  .then(result => {
    console.log(result)
  })
