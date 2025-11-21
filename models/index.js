const Blog = require('./blog')
const User = require('./user')
const UserBlog = require('./user_blogs')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlog, as: 'readings' })
Blog.belongsToMany(User, { through: UserBlog, as: 'reading_users' })

module.exports = {
  Blog, User, UserBlog
}