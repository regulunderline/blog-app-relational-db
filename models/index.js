const Blog = require('./blog')
const User = require('./user')
const UserBlog = require('./user_blogs')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserBlog, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: UserBlog, as: 'blogs_marked' })

module.exports = {
  Blog, User, UserBlog
}