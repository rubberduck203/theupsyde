module Rss =
    open System

    type Item = {
        Title: string
        Link: Uri
        Comments: Uri
        PublishDate: DateTimeOffset
        Description: string
    }

    type Channel = {
        Title: string
        Link: Uri
        Description: string
        LastBuildDate: DateTimeOffset
        Items: seq<Item>
    }

    type RssFeed = {
        Version: double
        Channel: Channel
    }

    open System
    open System.Xml
    let Parse input = 
        let document = XmlDocument()
        document.LoadXml input
        let rss = document.DocumentElement
        let version = rss.Attributes.ItemOf "version"
        
        let channelNode = rss.FirstChild

        let innerText (node: XmlNode) (name: string) = 
            let item = node.Item name
            item.InnerText

        let channelElementValue name =
            innerText channelNode name

        let itemNodes = seq {
            for element in channelNode.ChildNodes do
                if element.Name.Equals "item" then
                    yield element
        }

        let itemNodeToItem node = {
            Title = innerText node "title"
            Link = Uri(innerText node "link")
            Comments = Uri(innerText node "comments")
            PublishDate = DateTimeOffset.Parse(innerText node "pubDate")
            Description = innerText node "description"
         }
        
        let channel = {
            Title = channelElementValue "title"
            Link = Uri(channelElementValue "link")
            Description = channelElementValue "description"
            LastBuildDate = DateTimeOffset.Parse(channelElementValue "lastBuildDate")
            Items = itemNodes |> Seq.map(itemNodeToItem)
        }

        {Version = Double.Parse version.Value; Channel = channel}
        