import { montserrat } from "@/mui/fonts";
import { Grid, Link, Paper, Typography } from "@/mui/material";
import type { ClientComponent, ServerComponent } from "@/types/next";

interface LodexApiResponse<T> {
  data: T[];
}

interface LodexCollection {
  // Collection name
  aiDV?: string;

  // URL to the instance dedicated to this collection
  aoyf?: string;
}

interface LodexCorpus {
  _id: string;

  // Possible field names for the corpus title
  oSdp?: string;
  VGz4?: string;

  // Possible field names for the URL to the instance dedicated to this corpus
  Clj2?: string;
  acjh?: string;

  // This field is not returned by the API, it is added manually after the API call
  collection?: string;
}

async function getCorpus(): Promise<Array<LodexApiResponse<LodexCorpus>>> {
  // Get the collections
  const res = await fetch(
    "https://corpus-actualite.corpus.istex.fr/api/run/all-documents"
  );

  if (!res.ok) {
    throw new Error("Couldn't fetch the corpus collections!");
  }

  const corpusCollections: LodexApiResponse<LodexCollection> = await res.json();
  if (!Array.isArray(corpusCollections.data)) {
    throw new Error("Unexpected corpus collections response body!");
  }

  // Get the corpus list for each collection
  const collectionRequests = corpusCollections.data.map(
    async ({ aoyf: url, aiDV: collection }) => {
      if (url === undefined || url === "") {
        throw new Error("Unexpected corpus collection response body!");
      }

      const res = await fetch(new URL("api/run/all-documents", url));
      if (!res.ok) {
        throw new Error(
          `Couldn't fetch the corpus inside ${collection ?? ""}!`
        );
      }

      const corpus: LodexApiResponse<LodexCorpus> = await res.json();

      // Manually add the current collection name to each corpus from the list
      corpus.data.forEach((corpus) => {
        if (collection != null) {
          corpus.collection = collection;
        }
      });

      return corpus;
    }
  );

  return await Promise.all(collectionRequests);
}

const CorpusGrid: ServerComponent = async () => {
  const allCorpus = await getCorpus();
  const firstSixCorpus = allCorpus
    .map(({ data }) => data)
    .flat()
    .slice(0, 6);

  return (
    <Grid container spacing={1} sx={{ my: 2 }}>
      {firstSixCorpus.map((corpus) => (
        <CorpusCard
          key={corpus._id}
          title={corpus.oSdp ?? corpus.VGz4 ?? ""}
          collection={corpus.collection ?? ""}
          url={corpus.Clj2 ?? corpus.acjh ?? ""}
        />
      ))}
    </Grid>
  );
};

interface CorpusCardProps {
  title: string;
  collection: string;
  url: string;
}

const CorpusCard: ClientComponent<CorpusCardProps> = ({
  title,
  collection,
  url,
}) => (
  <Grid item xs={6}>
    <Paper elevation={0} sx={{ p: 2, bgcolor: "colors.white", height: "100%" }}>
      <Typography variant="body2">{collection}</Typography>
      <Link
        underline="hover"
        href={url}
        target="_blank"
        rel="noreferrer"
        sx={{
          color: "colors.blue",
          fontWeight: "bold",
          fontFamily: montserrat.style.fontFamily,
        }}
      >
        {title}
      </Link>
    </Paper>
  </Grid>
);

export default CorpusGrid;
