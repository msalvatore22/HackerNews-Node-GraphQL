const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => {
      const link = links.find(link => link.id === args.id)
      return link
    }
  },
  Mutation: {
    post: (parent, args) => {
       const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (_,{id, description, url}) => {
      const link = links.find(link => link.id === id)
      if(!link){
        throw new Error(`Couldn't find link with id ${id}`)
      }
      if(description !== undefined){
        link.description = description
      }
      if(url !== undefined){
        link.url = url
      }
      return link
    },
    deleteLink: (parent, args) => {
      const removeIndex = links.map(function(args){ return args.id }).indexOf(args.id)
      links.splice(removeIndex, 1)
      return links[removeIndex]
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))