FROM microsoft/aspnetcore:1.1.2
WORKDIR /app
COPY theupsyde/bin/Release/netcoreapp1.1/publish/ .
ENTRYPOINT ["dotnet", "theupsyde.dll"]