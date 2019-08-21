FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
WORKDIR /app
COPY theupsyde/bin/Release/netcoreapp2.2/publish/ .
ENTRYPOINT ["dotnet", "theupsyde.dll"]